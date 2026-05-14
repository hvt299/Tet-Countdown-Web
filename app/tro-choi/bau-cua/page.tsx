'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { ArrowLeft, History, Info } from 'lucide-react';
import { parseJwt, formatCoins } from '@/utils/tetHelper';
import Board from '@/components/bau-cua/Board';
import BetControls from '@/components/bau-cua/BetControls';
import DiceShaker from '@/components/bau-cua/DiceShaker';

export type GameState = 'BETTING' | 'SHAKING' | 'RESULT' | 'CLOSED';
export type AnimalBets = { bau: number; cua: number; tom: number; ca: number; ga: number; nai: number };

export default function BauCuaPage() {
    const router = useRouter();

    const [user, setUser] = useState<{ userId: string; fullName: string; coins: number } | null>(null);
    const [myCoins, setMyCoins] = useState(0);

    const socketRef = useRef<Socket | null>(null);
    const [gameState, setGameState] = useState<GameState>('CLOSED');
    const [timeLeft, setTimeLeft] = useState(0);
    const [sessionId, setSessionId] = useState('');
    const [result, setResult] = useState<string[]>([]);

    const [totalBets, setTotalBets] = useState<AnimalBets>({ bau: 0, cua: 0, tom: 0, ca: 0, ga: 0, nai: 0 });
    const [myBets, setMyBets] = useState<AnimalBets>({ bau: 0, cua: 0, tom: 0, ca: 0, ga: 0, nai: 0 });
    const [selectedChip, setSelectedChip] = useState(10);

    const [playerCount, setPlayerCount] = useState(0);
    const [resultModal, setResultModal] = useState<{ profit: number } | null>(null);
    const [showRules, setShowRules] = useState(false);

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
        if (!token) {
            router.push('/login');
            return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        const decoded = parseJwt(token);
        if (decoded) {
            setUser(decoded);
        }

        const socket = io(`${API_URL}/bau-cua`);
        socketRef.current = socket;

        if (decoded) {
            socket.emit('syncSession', { userId: decoded.sub });
        }

        socket.on('bauCua:syncData', (data: any) => {
            setMyBets(data.myBets);
            const betSum = Object.values(data.myBets).reduce((a: any, b: any) => a + b, 0) as number;

            axios.get(`${API_URL}/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                const dbCoins = res.data.coins || 0;
                if (data.gameState === 'BETTING' || data.gameState === 'SHAKING') {
                    setMyCoins(dbCoins - betSum);
                } else {
                    setMyCoins(dbCoins);
                }
            }).catch(err => console.error('Lỗi đồng bộ xu:', err));
        });

        const fetchMyCoins = () => {
            if (decoded) {
                axios.get(`${API_URL}/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(res => setMyCoins(res.data.coins || 0))
                    .catch(err => console.error('Lỗi lấy thông tin xu:', err));
            }
        };

        let lastSessionId = '';

        socket.on('bauCua:timeUpdate', (data: any) => {
            setGameState(data.state);
            setTimeLeft(data.time);
            setPlayerCount(data.playerCount || 0);

            if (lastSessionId && data.sessionId && data.sessionId !== lastSessionId) {
                setMyBets({ bau: 0, cua: 0, tom: 0, ca: 0, ga: 0, nai: 0 });
                setResultModal(null);
                fetchMyCoins();
            }

            lastSessionId = data.sessionId || '';

            if (data.state === 'RESULT' && data.time === 10) {
                setTimeout(() => {
                    fetchMyCoins();
                }, 1000);
            }

            setSessionId(data.sessionId || '');
            if (data.totalBets) setTotalBets(data.totalBets);
            if (data.result) setResult(data.result);
        });

        socket.on('bauCua:betSuccess', (data: any) => {
            setMyBets(prev => ({ ...prev, [data.animal]: prev[data.animal as keyof AnimalBets] + data.amount }));
            setMyCoins(prev => prev - data.amount);
        });

        socket.on('bauCua:betError', (data: any) => {
            alert(data.message);
        });

        socket.on('bauCua:clearSuccess', (data: any) => {
            setMyBets({ bau: 0, cua: 0, tom: 0, ca: 0, ga: 0, nai: 0 });
            setMyCoins(prev => prev + data.refund);

            console.log(data.message);
        });

        return () => {
            socket.disconnect();
        };
    }, [router]);

    useEffect(() => {
        if (gameState === 'RESULT' && result.length === 3) {
            const hasPlayed = Object.values(myBets).some(v => v > 0);
            if (hasPlayed) {
                let profit = 0;
                const resultCount: Record<string, number> = { bau: 0, cua: 0, tom: 0, ca: 0, ga: 0, nai: 0 };
                result.forEach(a => resultCount[a]++);

                for (const animal of Object.keys(myBets)) {
                    const betAmount = myBets[animal as keyof AnimalBets];
                    if (betAmount > 0) {
                        if (resultCount[animal] > 0) {
                            profit += betAmount * resultCount[animal];
                        } else {
                            profit -= betAmount;
                        }
                    }
                }
                setResultModal({ profit });
            }
        }
    }, [gameState, result]);

    const handlePlaceBet = (animal: string) => {
        if (gameState !== 'BETTING') return alert('Đã hết thời gian đặt cược!');
        if (myCoins < selectedChip) return alert('Bạn không đủ xu để đặt cược!');
        if (!user || !socketRef.current) return;

        socketRef.current.emit('placeBet', {
            userId: (user as any).sub,
            animal: animal,
            amount: selectedChip
        });
    };

    const handleClearBets = () => {
        if (gameState !== 'BETTING') return alert('Chỉ có thể hủy cược khi đang trong thời gian đặt cược!');

        if (!user || !socketRef.current) return;

        const hasBets = Object.values(myBets).some(amount => amount > 0);

        if (!hasBets) {
            return alert('Bạn chưa đặt cược ván này, không có gì để hủy!');
        }

        socketRef.current.emit('clearBets', {
            userId: (user as any).sub,
        });
    };

    const hasBets = Object.values(myBets).some(amount => amount > 0);

    return (
        <main className="relative min-h-screen flex flex-col font-sans overflow-x-hidden">
            {/* BACKGROUND */}
            <div className="inset-0 z-[-2] fixed">
                <Image src="/images/bg-tet.png" alt="Tet Background" fill className="object-cover" priority />
            </div>
            <div className="inset-0 z-10 bg-linear-to-b from-red-900/80 via-black/50 to-red-900/90 fixed"></div>

            {/* HEADER SÒNG BẠC */}
            <div className="fixed top-0 left-0 w-full py-3 px-4 md:px-6 z-50 flex justify-between items-center bg-red-950/30 backdrop-blur-md border-b border-yellow-500/20 shadow-sm transition-all">

                {/* 1. BÊN TRÁI (Dùng flex-1 và justify-start để đẩy lệch về mép trái) */}
                <div className="flex-1 flex justify-start items-center gap-2 md:gap-3">
                    <button onClick={() => router.push('/tro-choi')} className="shrink-0 text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium bg-red-950/50 px-3 py-1.5 rounded-full border border-red-800">
                        <ArrowLeft size={16} strokeWidth={2.5} /> <span className="hidden sm:inline">Thoát</span>
                    </button>

                    <button onClick={() => setShowRules(true)} className="shrink-0 text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium bg-red-950/50 px-2.5 md:px-3 py-1.5 rounded-full border border-red-800">
                        <Info size={16} strokeWidth={2.5} /> <span className="hidden sm:inline">Luật</span>
                    </button>
                </div>

                {/* 2. Ở GIỮA (Dùng flex-1 để chiếm 1/3 không gian, ép tiêu đề luôn căn giữa) */}
                <div className="flex-1 flex flex-col items-center justify-center px-1 overflow-hidden text-center shrink-0">
                    <h1 className="text-sm md:text-xl font-bold text-yellow-400 font-serif tracking-widest uppercase shadow-black drop-shadow-md truncate">
                        Bầu Cua Tôm Cá
                    </h1>
                    <p className="text-[10px] md:text-xs text-red-300 truncate">Phiên: <span className="font-mono text-yellow-500">#{sessionId.slice(-6) || '---'}</span></p>
                    <p className="text-[10px] md:text-xs text-green-400 mt-0.5 font-medium animate-pulse">👥 {playerCount} người đang chơi</p>
                </div>

                {/* 3. BÊN PHẢI (Dùng flex-1 và justify-end để đẩy lệch về mép phải) */}
                <div className="flex-1 flex justify-end items-center gap-2 md:gap-3">
                    <button onClick={() => router.push('/tro-choi/bau-cua/history')} className="shrink-0 text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium bg-red-950/50 px-3 py-1.5 rounded-full border border-red-800">
                        <History size={16} strokeWidth={2.5} /> <span className="hidden sm:inline">Lịch Sử</span>
                    </button>

                    {/* Khối Tiền (Đã design lại y hệt trang chủ) */}
                    <div
                        className="flex items-center gap-1 bg-yellow-900/40 px-2 md:px-3 py-1 rounded-full border border-yellow-500/40 shrink-0 shadow-lg"
                        title={`${myCoins.toLocaleString('vi-VN')} Xu`}
                    >
                        <span className="text-yellow-400 font-bold text-sm md:text-base truncate max-w-12.5 md:max-w-none text-center">
                            {formatCoins(myCoins)}
                        </span>
                        <span className="text-xs md:text-sm shrink-0">🪙</span>
                    </div>
                </div>
            </div>

            {/* KHU VỰC SÂN CHƠI CHÍNH VÀ MÀN HÌNH KHÓA */}
            {gameState === 'CLOSED' ? (
                // --- MÀN HÌNH KHI CHƯA TỚI TẾT HOẶC HẾT TẾT ---
                <div className="relative z-20 flex-1 flex items-center justify-center p-4">
                    <div className="bg-red-950/80 border border-yellow-500/50 rounded-2xl p-8 text-center shadow-2xl max-w-md w-full backdrop-blur-md animate-in zoom-in fade-in duration-500">
                        <div className="text-6xl mb-4 opacity-80">🔒</div>
                        <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 font-serif mb-4">Sòng Đã Đóng</h2>
                        <p className="text-red-200 text-sm md:text-base leading-relaxed mb-6">
                            Hội Bầu Cua Tôm Cá chỉ diễn ra vào đúng <strong className="text-yellow-500">3 ngày Tết (Mùng 1, 2, 3)</strong>. <br />
                            Quý khách vui lòng quay lại sau nhé!
                        </p>
                        <button
                            onClick={() => router.push('/tro-choi')}
                            className="bg-linear-to-r from-yellow-600 to-yellow-500 text-red-900 font-bold px-8 py-2.5 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.4)] hover:scale-105 transition-transform"
                        >
                            Quay lại Sảnh Trò Chơi
                        </button>
                    </div>
                </div>
            ) : (
                // --- SÂN CHƠI CHÍNH KHI ĐANG MỞ SÒNG ---
                <div className="relative z-20 flex-1 flex flex-col p-2 md:p-6 w-full max-w-6xl mx-auto h-full justify-center">

                    <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-6 md:gap-8 lg:mt-6">
                        {/* 1. KHU VỰC NHÀ CÁI */}
                        <div className="w-full lg:w-1/3 flex justify-center items-center shrink-0">
                            <DiceShaker gameState={gameState} timeLeft={timeLeft} result={result} />
                        </div>

                        {/* 2. BÀN CƯỢC */}
                        <div className="w-full lg:w-2/3 flex items-center justify-center">
                            <Board
                                gameState={gameState}
                                totalBets={totalBets}
                                myBets={myBets}
                                onPlaceBet={handlePlaceBet}
                                result={result}
                            />
                        </div>
                    </div>

                    {/* 3. KHAY PHỈNH */}
                    <div className="w-full flex justify-center mt-8 mb-4">
                        <BetControls
                            selectedChip={selectedChip}
                            onSelectChip={setSelectedChip}
                            onClearBets={handleClearBets}
                            hasBets={hasBets}
                            disabled={gameState !== 'BETTING'}
                        />
                    </div>
                </div>
            )}

            {/* POPUP LUẬT CHƠI BẦU CUA */}
            {showRules && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
                    <div className="bg-red-950 border border-yellow-500/50 rounded-2xl p-6 md:p-8 max-w-md w-full animate-in zoom-in duration-300 shadow-2xl">
                        <h2 className="text-2xl font-bold text-yellow-400 font-serif mb-4 flex items-center gap-2 border-b border-red-800/50 pb-2">
                            <Info /> Luật Chơi Bầu Cua
                        </h2>
                        <ul className="text-red-100 text-sm md:text-base space-y-3 mb-6 list-disc pl-5">
                            <li>Bạn có <strong className="text-yellow-400">60 giây</strong> để chọn phỉnh xu và đặt cược vào các linh vật.</li>
                            <li>Được phép <strong className="text-yellow-400">Hủy cược</strong> nhận lại tiền nếu đổi ý, nhưng chỉ áp dụng khi đồng hồ đang đếm ngược.</li>
                            <li>Hết giờ cược, hệ thống sẽ mất <strong className="text-yellow-400">10 giây để xóc đĩa</strong> và <strong className="text-yellow-400">10 giây để hiển thị kết quả</strong> trả thưởng.</li>
                            <li>
                                Tỷ lệ trả thưởng:
                                <br />- Trúng 1 con: Hoàn vốn cược + Nhận thêm tiền lời <strong className="text-green-400">x1</strong>.
                                <br />- Trúng 2 con: Hoàn vốn cược + Nhận thêm tiền lời <strong className="text-green-400">x2</strong>.
                                <br />- Trúng 3 con: Hoàn vốn cược + Nhận thêm tiền lời <strong className="text-green-400">x3</strong>.
                            </li>
                        </ul>
                        <button onClick={() => setShowRules(false)} className="w-full bg-yellow-600 hover:bg-yellow-500 text-red-950 font-bold py-2.5 rounded-xl transition-colors">
                            Đã Hiểu
                        </button>
                    </div>
                </div>
            )}

            {/* POPUP THÔNG BÁO THẮNG/THUA */}
            {resultModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
                    <div className="bg-linear-to-b from-red-900 to-red-950 border-4 border-yellow-500 rounded-3xl p-6 md:p-10 text-center shadow-[0_0_50px_rgba(250,204,21,0.5)] max-w-lg w-full animate-in zoom-in duration-300">
                        <div className="text-6xl mb-4">
                            {resultModal.profit > 0 ? '🎉' : resultModal.profit === 0 ? '🤝' : '💸'}
                        </div>
                        <h2 className={`text-2xl md:text-4xl font-black mb-2 uppercase drop-shadow-md ${resultModal.profit > 0 ? 'text-yellow-400' : resultModal.profit === 0 ? 'text-gray-300' : 'text-red-400'}`}>
                            {resultModal.profit > 0 ? 'CHÚC MỪNG!' : resultModal.profit === 0 ? 'HÒA VỐN!' : 'TRẮNG TAY!'}
                        </h2>

                        <div className="bg-black/50 border-2 border-yellow-600/50 rounded-xl py-4 mt-6 mb-8 shadow-inner">
                            <p className="text-gray-300 text-sm uppercase font-bold mb-1">
                                {resultModal.profit >= 0 ? 'Bạn Nhận Được' : 'Bạn Đã Thua'}
                            </p>
                            <p className={`text-4xl md:text-5xl font-black ${resultModal.profit >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                                {resultModal.profit > 0 ? '+' : ''}{formatCoins(resultModal.profit)} <span className="text-3xl filter-none">🪙</span>
                            </p>
                        </div>

                        <button
                            onClick={() => setResultModal(null)}
                            className="bg-linear-to-r from-yellow-500 to-yellow-600 text-red-950 font-black text-lg px-10 py-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            Chơi Ván Mới
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}