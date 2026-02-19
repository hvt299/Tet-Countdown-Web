'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { ArrowLeft, History, Info, Ticket } from 'lucide-react';
import { parseJwt, formatCoins } from '@/utils/tetHelper';
import LotoCaller from '@/components/loto/LotoCaller';
import TicketBoard from '@/components/loto/TicketBoard';

export type GameState = 'BUYING' | 'DRAWING' | 'CLOSED';

export default function LotoPage() {
    const router = useRouter();

    const [user, setUser] = useState<{ userId: string; fullName: string; coins: number } | null>(null);
    const [myCoins, setMyCoins] = useState(0);

    const socketRef = useRef<Socket | null>(null);
    const [gameState, setGameState] = useState<GameState>('CLOSED');
    const [timeLeft, setTimeLeft] = useState(0);
    const [sessionId, setSessionId] = useState('');
    const [jackpot, setJackpot] = useState(0);
    const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
    const [totalTicketsSold, setTotalTicketsSold] = useState(0);

    const [myTickets, setMyTickets] = useState<number[][][]>([]);

    const [playerCount, setPlayerCount] = useState(0);
    const [waitingKinhCount, setWaitingKinhCount] = useState(0);
    const [winnerModal, setWinnerModal] = useState<{ message: string, jackpot: number } | null>(null);
    const [showRules, setShowRules] = useState(false);

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
        if (!token) {
            router.push('/login');
            return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const decoded = parseJwt(token);
        if (decoded) setUser(decoded);

        const socket = io(`${API_URL}/loto`);
        socketRef.current = socket;

        if (decoded) {
            socket.emit('syncSession', { userId: decoded.sub });
        }

        const fetchMyCoins = () => {
            if (decoded) {
                axios.get(`${API_URL}/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(res => setMyCoins(res.data.coins || 0))
                    .catch(err => console.error('Lỗi lấy thông tin xu:', err));
            }
        };

        socket.on('loto:syncData', (data: any) => {
            setMyTickets(data.myTickets || []);
            setGameState(data.state);
            setTimeLeft(data.time);
            setSessionId(data.sessionId);
            setJackpot(data.jackpot);
            setDrawnNumbers(data.drawnNumbers);
            setTotalTicketsSold(data.totalTicketsSold);
            setPlayerCount(data.playerCount || 0);
            setWaitingKinhCount(data.waitingKinhCount || 0);
            fetchMyCoins();
        });

        let lastSessionId = '';

        socket.on('loto:timeUpdate', (data: any) => {
            setGameState(data.state);
            setTimeLeft(data.time);
            setJackpot(data.jackpot);
            setDrawnNumbers(data.drawnNumbers);
            setTotalTicketsSold(data.totalTicketsSold);
            setPlayerCount(data.playerCount || 0);
            setWaitingKinhCount(data.waitingKinhCount || 0);

            if (lastSessionId && data.sessionId && data.sessionId !== lastSessionId) {
                setMyTickets([]);
                setWinnerModal(null);
                fetchMyCoins();
            }
            lastSessionId = data.sessionId || '';
            setSessionId(data.sessionId || '');
        });

        socket.on('loto:buySuccess', (data: any) => {
            setMyTickets(prev => [...prev, data.ticket]);
            setMyCoins(prev => prev - 10);
        });

        socket.on('loto:kinhSuccess', (data: any) => {
            fetchMyCoins();
        });

        socket.on('loto:sessionEnded', (data: any) => {
            if (data.winnerId) {
                setWinnerModal({ message: data.message, jackpot: data.jackpot });
            } else {
                setWinnerModal({ message: '💨 Không ai KINH! Jackpot được cộng dồn!', jackpot: data.jackpot });
            }
            fetchMyCoins();
        });

        socket.on('loto:error', (data: any) => {
            alert(data.message);
            fetchMyCoins();
        });

        return () => {
            socket.disconnect();
        };
    }, [router]);

    const handleBuyTicket = () => {
        if (gameState !== 'BUYING') return alert('Chỉ có thể mua vé khi đang mở bán!');
        if (myTickets.length >= 3) return alert('Bạn đã mua tối đa 3 vé!');
        if (myCoins < 10) return alert('Bạn không đủ 10 xu để mua vé!');
        if (!user || !socketRef.current) return;

        socketRef.current.emit('buyTicket', { userId: (user as any).sub });
    };

    const handleKinh = (ticketIndex: number) => {
        if (gameState !== 'DRAWING') return;
        if (!user || !socketRef.current) return;

        socketRef.current.emit('callKinh', {
            userId: (user as any).sub,
            ticketIndex: ticketIndex
        });
    };

    return (
        <main className="relative min-h-screen flex flex-col font-sans overflow-x-hidden outline-none focus:outline-none">
            {/* BACKGROUND */}
            <div className="inset-0 z-[-2] fixed">
                <Image src="/bg-tet.png" alt="Tet Background" fill className="object-cover" priority />
            </div>
            <div className="inset-0 z-10 bg-linear-to-b from-red-900/80 via-black/50 to-red-900/90 fixed"></div>

            {/* HEADER SÒNG BẠC */}
            <div className="fixed top-0 left-0 w-full py-3 px-4 md:px-6 z-50 flex justify-between items-center bg-red-950/30 backdrop-blur-md border-b border-yellow-500/20 shadow-sm transition-all">
                <div className="flex-1 flex justify-start items-center gap-2 md:gap-3">
                    <button onClick={() => router.push('/tro-choi')} className="shrink-0 text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium bg-red-950/50 px-3 py-1.5 rounded-full border border-red-800">
                        <ArrowLeft size={16} strokeWidth={2.5} /> <span className="hidden sm:inline">Thoát</span>
                    </button>

                    <button onClick={() => setShowRules(true)} className="shrink-0 text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium bg-red-950/50 px-2.5 md:px-3 py-1.5 rounded-full border border-red-800">
                        <Info size={16} strokeWidth={2.5} /> <span className="hidden sm:inline">Luật</span>
                    </button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center px-1 overflow-hidden text-center shrink-0">
                    <h1 className="text-sm md:text-xl font-bold text-yellow-400 font-serif tracking-widest uppercase shadow-black drop-shadow-md truncate">
                        Lô Tô Đầu Xuân
                    </h1>
                    <p className="text-[10px] md:text-xs text-red-300 truncate">Phiên: <span className="font-mono text-yellow-500">#{sessionId.slice(-6) || '---'}</span></p>
                </div>

                <div className="flex-1 flex justify-end items-center gap-2 md:gap-3">
                    <button onClick={() => router.push('/tro-choi/loto/history')} className="shrink-0 text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium bg-red-950/50 px-3 py-1.5 rounded-full border border-red-800">
                        <History size={16} strokeWidth={2.5} /> <span className="hidden sm:inline">Lịch Sử</span>
                    </button>

                    <div className="flex items-center gap-1 bg-yellow-900/40 px-2 md:px-3 py-1 rounded-full border border-yellow-500/40 shrink-0 shadow-lg" title={`${myCoins.toLocaleString('vi-VN')} Xu`}>
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
                        <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 font-serif mb-4">Sảnh Đã Đóng</h2>
                        <p className="text-red-200 text-sm md:text-base leading-relaxed mb-6">
                            Sảnh Lô Tô Đầu Xuân chỉ mở cửa vào đúng <strong className="text-yellow-500">3 ngày (Mùng 4, 5, 6 Tết)</strong>. <br />
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
                <div className={`relative z-20 flex-1 flex w-full max-w-7xl mx-auto pt-20 px-2 md:px-6 gap-6 lg:gap-8 pb-10 transition-all duration-500
                    ${myTickets.length > 0 ? 'flex-col lg:flex-row items-start' : 'flex-col items-center justify-center'}
                `}>

                    {/* 1. KHU VỰC BẦU SHOW + NÚT MUA VÉ */}
                    <div className={`flex flex-col gap-4 w-full shrink-0 transition-all duration-500
                        ${myTickets.length > 0 ? 'lg:w-2/5 xl:w-1/3 lg:sticky lg:top-24' : 'max-w-md'}
                    `}>
                        <LotoCaller
                            gameState={gameState}
                            timeLeft={timeLeft}
                            drawnNumbers={drawnNumbers}
                            jackpot={jackpot}
                            totalTicketsSold={totalTicketsSold}
                            playerCount={playerCount}
                            waitingKinhCount={waitingKinhCount}
                        />

                        {/* NÚT MUA VÉ NẰM NGAY DƯỚI BẦU SHOW */}
                        <button
                            onClick={handleBuyTicket}
                            disabled={gameState !== 'BUYING' || myTickets.length >= 3}
                            className={`w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-lg md:text-xl transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.5)] border-2
                                ${gameState === 'BUYING' && myTickets.length < 3
                                    ? 'bg-linear-to-r from-red-600 to-red-800 text-yellow-400 border-yellow-500 hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(220,38,38,0.5)]'
                                    : 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed opacity-90'}
                            `}
                        >
                            <Ticket size={24} />
                            {myTickets.length >= 3 ? 'Đã Mua Tối Đa Vé' : 'Mua Vé (10 Xu)'}
                        </button>
                    </div>

                    {/* 2. KHU VỰC BÀN VÉ (Chỉ hiện khi có vé và cuộn không viền) */}
                    {myTickets.length > 0 && (
                        <div className="w-full lg:w-3/5 xl:w-2/3 max-h-[75vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-10 outline-none focus:outline-none">
                            <TicketBoard
                                myTickets={myTickets}
                                drawnNumbers={drawnNumbers}
                                gameState={gameState}
                                onKinh={handleKinh}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* POPUP LUẬT CHƠI LÔ TÔ */}
            {showRules && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
                    <div className="bg-red-950 border border-yellow-500/50 rounded-2xl p-6 md:p-8 max-w-md w-full animate-in zoom-in duration-300 shadow-2xl">
                        <h2 className="text-2xl font-bold text-yellow-400 font-serif mb-4 flex items-center gap-2 border-b border-red-800/50 pb-2">
                            <Info /> Luật Chơi Lô Tô
                        </h2>
                        <ul className="text-red-100 text-sm md:text-base space-y-3 mb-6 list-disc pl-5">
                            <li>Bạn có <strong className="text-yellow-400">10 phút</strong> để mua vé đầu ván. Mua tối đa <strong className="text-yellow-400">3 vé</strong> với giá 10 xu/vé.</li>
                            <li>Khi sòng đóng, hệ thống sẽ bốc 1 số ngẫu nhiên sau mỗi <strong className="text-yellow-400">10 giây</strong>.</li>
                            <li>Tờ vé đủ điều kiện KINH khi có <strong className="text-yellow-400">đúng 5 số trên cùng 1 hàng ngang</strong> khớp với các số đã bốc.</li>
                            <li>Ai bấm <strong>KINH!</strong> nhanh nhất sẽ ẵm trọn quỹ Jackpot. Nếu không ai Kinh, tiền được cộng dồn sang ván sau!</li>
                            <li><strong className="text-red-400">Lưu ý:</strong> Bấm Kinh khi chưa đủ 5 số sẽ bị phạt trừ <strong className="text-red-400">100 xu</strong>. Hãy nhìn kỹ vé chớp sáng rồi mới bấm nhé!</li>
                        </ul>
                        <button onClick={() => setShowRules(false)} className="w-full bg-yellow-600 hover:bg-yellow-500 text-red-950 font-bold py-2.5 rounded-xl transition-colors">
                            Đã Hiểu
                        </button>
                    </div>
                </div>
            )}

            {/* POPUP THÔNG BÁO CHIẾN THẮNG */}
            {winnerModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
                    <div className="bg-linear-to-b from-red-900 to-red-950 border-4 border-yellow-500 rounded-3xl p-6 md:p-10 text-center shadow-[0_0_50px_rgba(250,204,21,0.5)] max-w-lg w-full animate-in zoom-in duration-300">
                        <div className="text-6xl mb-4 animate-bounce">🎉</div>
                        <h2 className="text-2xl md:text-4xl font-black text-yellow-400 mb-4 uppercase drop-shadow-md">
                            KẾT QUẢ VÁN ĐẤU
                        </h2>
                        <p className="text-white text-lg md:text-xl font-medium mb-6 leading-relaxed">
                            {winnerModal.message}
                        </p>
                        <div className="bg-black/50 border-2 border-yellow-600 rounded-xl py-4 mb-8 shadow-inner">
                            <p className="text-yellow-500/80 text-sm uppercase font-bold mb-1">Giải Thưởng</p>
                            <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-yellow-600">
                                {formatCoins(winnerModal.jackpot)} <span className="text-3xl filter-none">🪙</span>
                            </p>
                        </div>
                        <button
                            onClick={() => setWinnerModal(null)}
                            className="bg-linear-to-r from-yellow-500 to-yellow-600 text-red-950 font-black text-lg px-10 py-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            Đóng & Tiếp Tục
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}