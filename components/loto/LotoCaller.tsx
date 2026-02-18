'use client';

import { formatCoins } from '@/utils/tetHelper';

interface LotoCallerProps {
    gameState: 'BUYING' | 'DRAWING' | 'CLOSED';
    timeLeft: number;
    drawnNumbers: number[];
    jackpot: number;
    totalTicketsSold: number;
    playerCount: number;
    waitingKinhCount: number;
}

export default function LotoCaller({ gameState, timeLeft, drawnNumbers, jackpot, totalTicketsSold, playerCount, waitingKinhCount }: LotoCallerProps) {
    const currentNumber = drawnNumbers.length > 0 ? drawnNumbers[drawnNumbers.length - 1] : null;
    const recentNumbers = drawnNumbers.slice(0, -1).reverse().slice(0, 7);

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center relative mt-4 outline-none focus:outline-none">
            {/* Thanh Trạng Thái & Đếm Ngược */}
            <div className="absolute -top-6 bg-red-950 border-2 border-yellow-500 px-6 py-1.5 rounded-full z-20 shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex items-center gap-3">
                <span className={`font-bold uppercase tracking-widest text-sm md:text-base ${gameState === 'DRAWING' ? 'text-orange-500 animate-pulse' : 'text-yellow-400'}`}>
                    {gameState === 'BUYING' ? 'Mở Bán Vé' : gameState === 'DRAWING' ? 'Đang Kêu Lô Tô' : 'Đóng Sòng'}
                </span>
                <span className="text-white font-mono bg-black/60 px-3 py-0.5 rounded-md text-lg font-bold border border-yellow-500/30 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]">
                    {timeLeft}s
                </span>
            </div>

            {/* Bảng Hiển Thị Chính */}
            <div className="w-full bg-linear-to-b from-red-900 to-red-950 rounded-3xl border-4 border-yellow-500/60 shadow-[0_0_30px_rgba(0,0,0,0.8)] p-6 md:p-8 flex flex-col items-center pt-10 outline-none focus:outline-none">

                {/* Khu vực Jackpot */}
                <div className="text-center mb-6 w-full">
                    <p className="text-yellow-500/80 font-bold uppercase tracking-widest text-xs md:text-sm mb-1">Tổng Giải Thưởng</p>
                    <h2 className="text-3xl md:text-5xl font-extrabold flex items-center justify-center gap-2 drop-shadow-lg">
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-300 via-yellow-500 to-yellow-300">
                            {formatCoins(jackpot)}
                        </span>
                        <span className="text-2xl md:text-4xl inline-block drop-shadow-none filter-none">🪙</span>
                    </h2>

                    {/* BẢNG THỐNG KÊ REAL-TIME */}
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-4 text-xs md:text-sm">
                        <span className="bg-black/40 px-3 py-1.5 rounded-full border border-gray-600 text-gray-300 shadow-inner">
                            👥 Người chơi: <strong className="text-white">{playerCount}</strong>
                        </span>
                        <span className="bg-black/40 px-3 py-1.5 rounded-full border border-gray-600 text-gray-300 shadow-inner">
                            🎟️ Vé đã bán: <strong className="text-white">{totalTicketsSold}</strong>
                        </span>
                        {gameState === 'DRAWING' && waitingKinhCount > 0 && (
                            <span className="bg-red-900 px-3 py-1.5 rounded-full border border-red-500 text-yellow-300 animate-pulse font-bold shadow-[0_0_10px_rgba(220,38,38,0.8)]">
                                🔥 Đang chờ KINH: {waitingKinhCount}
                            </span>
                        )}
                    </div>
                </div>

                {/* Khu vực Gọi Số (Chỉ hiện khi DRAWING) */}
                {gameState === 'DRAWING' ? (
                    <div className="flex flex-col items-center w-full animate-in fade-in zoom-in duration-500">
                        {/* Số hiện tại to đùng */}
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-linear-to-br from-yellow-100 to-white rounded-full border-8 border-yellow-500 flex items-center justify-center shadow-[0_0_40px_rgba(250,204,21,0.6)] mb-6 transform scale-110">
                            <span className="text-5xl md:text-7xl font-black text-red-700 drop-shadow-md">
                                {currentNumber}
                            </span>
                        </div>

                        {/* Lịch sử các số vừa gọi */}
                        <div className="w-full bg-black/40 rounded-xl p-3 border border-red-800 flex flex-nowrap items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            <span className="text-gray-400 text-xs uppercase font-bold shrink-0 mr-2">Vừa ra:</span>
                            {recentNumbers.map((num, idx) => (
                                <div key={idx} className="shrink-0 w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-800 shadow-inner border border-gray-400 opacity-80">
                                    {num}
                                </div>
                            ))}
                            {recentNumbers.length === 0 && <span className="text-gray-500 text-sm italic shrink-0">Chưa có số nào...</span>}
                        </div>
                    </div>
                ) : (
                    <div className="py-8 text-center text-yellow-500/50 font-serif text-lg md:text-2xl italic tracking-wider">
                        {gameState === 'BUYING' ? 'Nhanh tay mua vé săn Jackpot nào!' : 'Hẹn gặp lại năm sau!'}
                    </div>
                )}
            </div>
        </div>
    );
}