'use client';

interface DiceShakerProps {
    gameState: 'BETTING' | 'SHAKING' | 'RESULT' | 'CLOSED';
    timeLeft: number;
    result: string[];
}

const ANIMAL_ICONS: Record<string, string> = {
    nai: '🦌', bau: '🥒', ga: '🐓', ca: '🐟', cua: '🦀', tom: '🦐'
};

export default function DiceShaker({ gameState, timeLeft, result }: DiceShakerProps) {
    return (
        <div className="relative flex flex-col items-center justify-center w-full mt-4">
            {/* Đồng hồ Trạng thái */}
            <div className="absolute -top-5 bg-red-950 border-2 border-yellow-500 px-5 py-1.5 rounded-full z-20 shadow-lg flex items-center gap-3 transform -translate-y-2">
                <span className={`font-bold uppercase tracking-wider text-sm md:text-base ${gameState === 'SHAKING' ? 'text-orange-500 animate-pulse' : 'text-yellow-400'}`}>
                    {gameState === 'BETTING' ? 'Mời Đặt Cược' : gameState === 'SHAKING' ? 'Đang Xóc Đĩa...' : gameState === 'RESULT' ? 'Mở Bát' : 'Đóng Sòng'}
                </span>
                <span className="text-white font-mono bg-black/60 px-2 py-0.5 rounded text-lg font-bold border border-yellow-500/30">
                    {timeLeft}s
                </span>
            </div>

            {/* Cái Bát / Đĩa */}
            <div className={`relative w-40 h-40 md:w-52 md:h-52 bg-linear-to-b from-red-800 to-red-950 rounded-full border-10 border-yellow-600 shadow-[inset_0_0_30px_rgba(0,0,0,0.8),0_15px_30px_rgba(0,0,0,0.6)] flex items-center justify-center
                ${gameState === 'SHAKING' ? 'animate-bounce' : ''}
            `}>
                <div className="absolute inset-2 border-2 border-yellow-500/20 rounded-full border-dashed"></div>

                {/* Kết quả Xúc xắc (Chỉ hiện khi Mở bát) */}
                {gameState === 'RESULT' && result.length === 3 ? (
                    <div className="flex flex-wrap justify-center gap-1 md:gap-2 z-10 animate-in zoom-in duration-500">
                        {result.map((animal, idx) => (
                            <div key={idx} className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl shadow-[inset_0_-4px_4px_rgba(0,0,0,0.2)] border-2 border-gray-300 flex items-center justify-center text-3xl md:text-4xl transform hover:scale-110 transition-transform odd:-rotate-12 even:rotate-12">
                                {ANIMAL_ICONS[animal]}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent rounded-full flex items-center justify-center z-10">
                        <span className="text-yellow-500/30 font-serif text-xl tracking-widest font-bold">
                            TẾT {new Date().getFullYear()}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}