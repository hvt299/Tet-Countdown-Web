'use client';

import { formatCoins } from '@/utils/tetHelper';

interface BoardProps {
    gameState: 'BETTING' | 'SHAKING' | 'RESULT' | 'CLOSED';
    totalBets: Record<string, number>;
    myBets: Record<string, number>;
    onPlaceBet: (animal: string) => void;
    result: string[];
}

const ANIMALS = [
    { id: 'nai', name: 'Nai', icon: '🦌', color: 'from-orange-700 to-orange-900' },
    { id: 'bau', name: 'Bầu', icon: '🥒', color: 'from-green-600 to-green-800' },
    { id: 'ga', name: 'Gà', icon: '🐓', color: 'from-yellow-600 to-yellow-800' },
    { id: 'ca', name: 'Cá', icon: '🐟', color: 'from-blue-600 to-blue-800' },
    { id: 'cua', name: 'Cua', icon: '🦀', color: 'from-red-600 to-red-800' },
    { id: 'tom', name: 'Tôm', icon: '🦐', color: 'from-orange-500 to-red-700' },
];

export default function Board({ gameState, totalBets, myBets, onPlaceBet, result }: BoardProps) {
    return (
        <div className="w-full max-w-2xl mx-auto p-3 md:p-6 bg-red-950/80 rounded-3xl border-4 border-yellow-500/50 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <div className="grid grid-cols-3 gap-2 md:gap-4">
                {ANIMALS.map((animal) => {
                    const total = totalBets[animal.id] || 0;
                    const mine = myBets[animal.id] || 0;

                    const isWinning = gameState === 'RESULT' && result.includes(animal.id);

                    return (
                        <button
                            key={animal.id}
                            onClick={() => onPlaceBet(animal.id)}
                            disabled={gameState !== 'BETTING'}
                            className={`relative group flex flex-col items-center justify-center p-2 md:p-4 rounded-xl border-2 transition-all duration-300
                                ${gameState === 'BETTING' ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-not-allowed opacity-90'}
                                ${isWinning ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.8)] animate-pulse bg-yellow-400/20' : 'border-yellow-500/30 bg-linear-to-b ' + animal.color}
                            `}
                        >
                            {/* Phỉnh cược của riêng bạn (Góc trên phải) */}
                            {mine > 0 && (
                                <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-8 h-8 md:w-10 md:h-10 bg-yellow-500 rounded-full border-2 border-red-900 flex items-center justify-center shadow-lg transform rotate-12 z-10 animate-in zoom-in duration-200">
                                    <span className="text-[10px] md:text-xs font-bold text-red-900 font-mono">
                                        {formatCoins(mine)}
                                    </span>
                                </div>
                            )}

                            {/* Icon Linh vật */}
                            <div className={`text-4xl md:text-6xl mb-1 md:mb-2 drop-shadow-lg transition-transform ${gameState === 'BETTING' ? 'group-hover:-translate-y-1 group-hover:rotate-6' : ''}`}>
                                {animal.icon}
                            </div>

                            <h3 className="text-yellow-400 font-bold text-sm md:text-lg uppercase tracking-wider hidden md:block">
                                {animal.name}
                            </h3>

                            {/* Tổng tiền Server đặt vào ô này */}
                            <div className="mt-1 md:mt-2 w-full bg-black/40 rounded px-2 py-1 text-center border border-black/50">
                                <span className="text-xs md:text-sm font-mono text-white">
                                    Tổng: <span className="text-yellow-400 font-bold">{formatCoins(total)} 🪙</span>
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}