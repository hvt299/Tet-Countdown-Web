'use client';

interface LotoTicketProps {
    matrix: number[][];
    drawnNumbers: number[];
    ticketIndex: number;
    onKinh: (index: number) => void;
    gameState: 'BUYING' | 'DRAWING' | 'CLOSED';
}

export default function LotoTicket({ matrix, drawnNumbers, ticketIndex, onKinh, gameState }: LotoTicketProps) {
    const checkTicketStatus = () => {
        let maxMatch = 0;
        let isReady = false;

        for (let r = 0; r < 3; r++) {
            let matchCount = 0;
            let targetCount = 0;
            for (let c = 0; c < 9; c++) {
                if (matrix[r][c] > 0) {
                    targetCount++;
                    if (drawnNumbers.includes(matrix[r][c])) matchCount++;
                }
            }
            if (targetCount === 5 && matchCount === 5) isReady = true;
            if (matchCount > maxMatch) maxMatch = matchCount;
        }
        return {
            isReady,
            isAlmostReady: maxMatch === 4 && !isReady && gameState === 'DRAWING'
        };
    };

    const { isReady, isAlmostReady } = checkTicketStatus();

    return (
        <div className={`relative w-full max-w-2xl mx-auto p-2 md:p-4 rounded-xl border-4 font-sans transition-all duration-500 outline-none focus:outline-none
            ${isReady
                ? 'bg-yellow-100 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.9)] animate-pulse scale-[1.02]'
                : isAlmostReady
                    ? 'bg-orange-50/90 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.6)] animate-pulse'
                    : 'bg-yellow-50/90 border-yellow-600 shadow-xl'}
        `}>
            {/* Tiêu đề vé */}
            <div className="flex justify-between items-center mb-2 border-b-2 border-yellow-600/30 pb-2">
                <span className="text-red-800 font-bold uppercase tracking-widest text-sm md:text-base">
                    Vé Tờ Số {ticketIndex + 1}
                </span>

                {/* Nút KINH! nằm ngay trên vé, sáng lên khi đủ điều kiện */}
                <button
                    onClick={() => onKinh(ticketIndex)}
                    disabled={gameState !== 'DRAWING'}
                    className={`px-4 py-1.5 rounded-full font-bold uppercase transition-all duration-300 shadow-md text-xs md:text-sm
                        ${gameState !== 'DRAWING'
                            ? 'bg-gray-500 text-gray-300 border-2 border-gray-600 cursor-not-allowed opacity-70'
                            : isReady
                                ? 'bg-red-600 text-yellow-300 border-2 border-yellow-400 animate-bounce hover:scale-110 cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.8)]'
                                : 'bg-red-900/80 text-red-200 border border-red-700 hover:bg-red-700 active:scale-90 cursor-pointer'}
                    `}
                >
                    Kinh!
                </button>
            </div>

            {/* Lưới Lô Tô 3 hàng x 9 cột */}
            <div className="flex flex-col gap-1 md:gap-2">
                {matrix.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-9 gap-1 md:gap-2">
                        {row.map((num, colIndex) => {
                            const isDrawn = num > 0 && drawnNumbers.includes(num);

                            return (
                                <div
                                    key={colIndex}
                                    className={`
                                        flex items-center justify-center aspect-square rounded-md border text-sm md:text-xl font-bold transition-all duration-500
                                        ${num === 0
                                            ? 'bg-transparent border-dashed border-gray-300/50'
                                            : isDrawn
                                                ? 'bg-yellow-400 text-red-700 border-red-500 shadow-[inset_0_0_10px_rgba(220,38,38,0.3)] scale-105'
                                                : 'bg-white text-gray-800 border-gray-300 shadow-sm'}
                                    `}
                                >
                                    {num > 0 ? num : ''}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}