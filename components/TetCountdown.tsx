'use client';

import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { checkTetState, TetState } from '@/utils/tetHelper';
import { Fireworks } from '@fireworks-js/react';
import FallingFlowers from './FallingFlowers';

// Font chữ Google (bạn nhớ import trong layout hoặc globals.css nếu cần, ở đây dùng className mặc định cho tiện)

const TetCountdown = () => {
    const { width, height } = useWindowSize();
    const [tetState, setTetState] = useState<TetState | null>(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setTetState(checkTetState());

        const interval = setInterval(() => {
            const currentState = checkTetState();
            setTetState(currentState);

            if (!currentState.isTet) {
                const now = new Date().getTime();
                const distance = currentState.targetDate - now;

                if (distance > 0) {
                    setTimeLeft({
                        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                        seconds: Math.floor((distance % (1000 * 60)) / 1000),
                    });
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!isClient || !tetState) return null;

    // --- TRƯỜNG HỢP 1: ĐANG LÀ TẾT ---
    if (tetState.isTet) {
        return (
            <div className="relative z-20 flex flex-col items-center justify-center text-center animate-bounce-slow px-4 h-screen">
                <Fireworks
                    options={{
                        opacity: 0.5,
                        particles: 200,
                        explosion: 5,
                        intensity: 30,
                    }}
                    style={{
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        position: 'fixed',
                        zIndex: -1,
                    }}
                />

                <Confetti width={width} height={height} numberOfPieces={100} gravity={0.15} />

                <h1 className="text-4xl md:text-7xl font-black text-yellow-400 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] mb-6 font-serif uppercase animate-bounce-slow">
                    Chúc Mừng Năm Mới
                </h1>
                <div className="bg-red-800/80 px-8 py-4 rounded-full border-2 border-yellow-500 shadow-xl backdrop-blur-sm">
                    <p className="text-2xl md:text-4xl text-white font-bold font-serif">
                        Xuân {tetState.lunarYearName}
                    </p>
                </div>
            </div>
        );
    }

    // --- TRƯỜNG HỢP 2: ĐẾM NGƯỢC ---
    return (
        <div className="z-20 flex flex-col items-center px-4 w-full">
            <FallingFlowers />
            
            <div className="mb-10 text-center">
                <h2 className="text-xl md:text-3xl text-white font-medium mb-2 drop-shadow-md tracking-widest uppercase">
                    Sắp đến Tết
                </h2>
                <h1 className="text-4xl md:text-7xl font-black text-yellow-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] font-serif uppercase">
                    {tetState.lunarYearName}
                </h1>
            </div>

            <div className="grid grid-cols-4 gap-3 md:gap-6 w-full max-w-4xl justify-center">
                <TimeBox value={timeLeft.days} label="Ngày" />
                <TimeBox value={timeLeft.hours} label="Giờ" />
                <TimeBox value={timeLeft.minutes} label="Phút" />
                <TimeBox value={timeLeft.seconds} label="Giây" />
            </div>

            <p className="mt-12 text-white/80 text-lg md:text-xl font-light italic tracking-wider drop-shadow-md bg-black/20 px-6 py-2 rounded-full backdrop-blur-sm">
                "Đếm từng khoảnh khắc, đón xuân an lành"
            </p>
        </div>
    );
};

const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center group">
        <div className="relative w-16 h-20 md:w-32 md:h-36 flex items-center justify-center bg-red-900/90 text-yellow-300 text-3xl md:text-6xl font-bold rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.5)] border border-yellow-500/50 backdrop-blur-md transform transition-transform group-hover:-translate-y-2">
            {/* Hiệu ứng bóng sáng bên trong */}
            <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-white/10 to-transparent pointer-events-none"></div>

            {value < 10 ? `0${value}` : value}
        </div>
        <span className="mt-4 text-xs md:text-lg font-bold text-white uppercase tracking-widest drop-shadow-md bg-red-800/80 px-3 py-1 rounded-md">
            {label}
        </span>
    </div>
);

export default TetCountdown;