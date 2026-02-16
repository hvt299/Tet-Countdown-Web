'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { ArrowLeft, History } from 'lucide-react';
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

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
        if (!token) {
            router.push('/login');
            return;
        }

        const decoded = parseJwt(token);
        if (decoded) {
            setUser(decoded);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            axios.get(`${API_URL}/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                setMyCoins(res.data.coins || 0);
            }).catch(err => console.error('Lỗi lấy thông tin xu:', err));
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const socket = io(`${API_URL}/bau-cua`);
        socketRef.current = socket;

        let lastSessionId = '';

        socket.on('bauCua:timeUpdate', (data: any) => {
            setGameState(data.state);
            setTimeLeft(data.time);

            if (data.sessionId && data.sessionId !== lastSessionId) {
                setMyBets({ bau: 0, cua: 0, tom: 0, ca: 0, ga: 0, nai: 0 });
                lastSessionId = data.sessionId;
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

    const handlePlaceBet = (animal: string) => {
        if (gameState !== 'BETTING') return alert('Đã hết thời gian đặt cược!');
        if (myCoins < selectedChip) return alert('Bạn không đủ xu để đặt cược!');
        if (!user || !socketRef.current) return;

        socketRef.current.emit('placeBet', {
            userId: user.userId || (user as any)._id || (user as any).sub,
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
            userId: user.userId || (user as any)._id
        });
    };

    const hasBets = Object.values(myBets).some(amount => amount > 0);

    return (
        <main className="relative min-h-screen flex flex-col font-sans overflow-hidden bg-red-950">
            {/* BACKGROUND */}
            <div className="inset-0 z-0 fixed">
                <Image src="/bg-tet.png" alt="Tet Background" fill className="object-cover opacity-50" priority />
            </div>

            {/* HEADER SÒNG BẠC */}
            <div className="relative z-20 flex items-center justify-between p-2 md:p-4 bg-black/40 backdrop-blur-md border-b border-yellow-500/30">
                {/* Nút Thoát (Bên trái) */}
                <button onClick={() => router.push('/tro-choi')} className="shrink-0 text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium bg-red-950/50 px-3 py-1.5 rounded-full border border-red-800">
                    <ArrowLeft size={16} strokeWidth={2.5} /> <span className="hidden sm:inline">Thoát</span>
                </button>

                {/* Tiêu đề (Ở giữa) */}
                <div className="text-center flex-1 px-1 overflow-hidden">
                    <h1 className="text-sm md:text-xl font-bold text-yellow-400 font-serif tracking-widest uppercase shadow-black drop-shadow-md truncate">
                        Bầu Cua Tôm Cá
                    </h1>
                    <p className="text-[10px] md:text-xs text-red-300 truncate">Phiên: <span className="font-mono text-yellow-500">#{sessionId.slice(-6) || '---'}</span></p>
                </div>

                {/* Nút Lịch sử & Số Dư (Bên phải) */}
                <div className="shrink-0 flex items-center gap-2 md:gap-3">
                    <button onClick={() => router.push('/tro-choi/bau-cua/history')} className="shrink-0 text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium bg-red-950/50 px-3 py-1.5 rounded-full border border-red-800">
                        <History size={16} strokeWidth={2.5} /> <span className="hidden sm:inline">Lịch Sử</span>
                    </button>

                    <div
                        className="flex items-center gap-1 bg-yellow-900/80 px-2 md:px-4 py-1.5 rounded-full border border-yellow-500/40 shadow-inner"
                        title={`${myCoins.toLocaleString('vi-VN')} Xu`}
                    >
                        <span className="text-yellow-400 font-bold text-xs md:text-lg text-center max-w-15 md:max-w-none truncate">
                            {formatCoins(myCoins)}
                        </span>
                        <span className="text-xs md:text-base shrink-0">🪙</span>
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
        </main>
    );
}